import requests
import argparse
import sys
import random
from faker import Faker

fake = Faker()

class APIClient:
    def __init__(self, base_url, username, password):
        self.base_url = base_url.rstrip('/')
        self.username = username
        self.password = password
        self.token = None
        self.headers = {'Content-Type': 'application/json'}

    def set_token(self, token):
        self.token = token
        self.headers['Authorization'] = f"Bearer {self.token}"


    def login(self):
        url = f"{self.base_url}/api/auth/login"
        data = {
            "username": self.username,
            "password": self.password
        }
        # The login endpoint likely expects form data (OAuth2PasswordRequestForm) or JSON
        # Let's try form data first as it's common for FastAPI/OAuth2
        try:
            response = requests.post(url, data=data) 
            if response.status_code != 200:
                # Try JSON if form data fails
                response = requests.post(url, json=data)
            
            if response.status_code == 200:
                self.token = response.json().get('access_token')
                self.headers['Authorization'] = f"Bearer {self.token}"
                print(f"✅ Login successful for {self.username}")
                return True
            else:
                print(f"❌ Login failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ Login exception: {e}")
            return False

    def get(self, endpoint):
        return requests.get(f"{self.base_url}{endpoint}", headers=self.headers)

    def post(self, endpoint, data):
        return requests.post(f"{self.base_url}{endpoint}", json=data, headers=self.headers)

    def put(self, endpoint, data):
        return requests.put(f"{self.base_url}{endpoint}", json=data, headers=self.headers)

    def delete(self, endpoint):
        return requests.delete(f"{self.base_url}{endpoint}", headers=self.headers)

class BaseTest:
    def __init__(self, client, id_field=None):
        self.client = client
        self.resource_name = "Resource"
        self.base_endpoint = ""
        self.id_field = id_field

    def test_all(self):
        print(f"\n--- Testing {self.resource_name} ---")
        if not self.test_meta(): return False
        if not self.test_list(): return False
        created_id = self.test_create()
        if not created_id: return False
        if not self.test_get(created_id): return False
        if not self.test_update(created_id): return False
        if not self.test_delete(created_id): return False
        print(f"✅ All {self.resource_name} tests passed")
        return True

    def test_meta(self):
        response = self.client.get(f"{self.base_endpoint}meta")
        if response.status_code == 200:
            print(f"✅ GET {self.base_endpoint}meta")
            return True
        else:
            print(f"❌ GET {self.base_endpoint}meta failed: {response.status_code} - {response.text}")
            return False

    def test_list(self):
        response = self.client.get(f"{self.base_endpoint}")
        if response.status_code == 200:
            print(f"✅ GET {self.base_endpoint}")
            return True
        else:
            print(f"❌ GET {self.base_endpoint} failed: {response.status_code} - {response.text}")
            return False

    def generate_payload(self):
        raise NotImplementedError

    def test_create(self):
        payload = self.generate_payload()
        response = self.client.post(f"{self.base_endpoint}", payload)
        if response.status_code in [200, 201]:
            data = response.json()
            data = response.json()
            
            # Use explicit ID field if available
            if self.id_field and self.id_field in data:
                obj_id = data[self.id_field]
                print(f"✅ POST {self.base_endpoint} (Created ID: {obj_id})")
                return obj_id
            
            # Fallback: Try to find ID case-insensitively
            id_key = next((k for k in data.keys() if k.lower().endswith('id')), None)
            if id_key:
                obj_id = data[id_key]
                print(f"✅ POST {self.base_endpoint} (Created ID: {obj_id})")
                return obj_id
            else:
                print(f"⚠️ POST {self.base_endpoint} succeeded but ID not found in response. Keys: {list(data.keys())}")
                return None
        else:
            print(f"❌ POST {self.base_endpoint} failed: {response.status_code} - {response.text}")
            return None

    def test_get(self, obj_id):
        response = self.client.get(f"{self.base_endpoint}{obj_id}")
        if response.status_code == 200:
            print(f"✅ GET {self.base_endpoint}{{id}}")
            return True
        else:
            print(f"❌ GET {self.base_endpoint}{{id}} failed: {response.status_code} - {response.text}")
            return False

    def update_payload(self):
        # Default to same as create, can be overridden
        return self.generate_payload()

    def test_update(self, obj_id):
        payload = self.update_payload()
        response = self.client.put(f"{self.base_endpoint}{obj_id}", payload)
        if response.status_code == 200:
            print(f"✅ PUT {self.base_endpoint}{{id}}")
            return True
        else:
            print(f"❌ PUT {self.base_endpoint}{{id}} failed: {response.status_code} - {response.text}")
            return False

    def test_delete(self, obj_id):
        response = self.client.delete(f"{self.base_endpoint}{obj_id}")
        if response.status_code in [200, 204]:
            print(f"✅ DELETE {self.base_endpoint}{{id}}")
            return True
        else:
            print(f"❌ DELETE {self.base_endpoint}{{id}} failed: {response.status_code} - {response.text}")
            return False

class AccountsTest(BaseTest):
    def __init__(self, client):
        super().__init__(client, id_field="AccountId")
        self.resource_name = "Accounts"
        self.base_endpoint = "/api/v1/accounts/"

    def generate_payload(self):
        return {
            "Name": fake.company(),
            "Code": fake.unique.lexify(text='??????').upper() + str(random.randint(100, 999))
        }

    def test_batch(self):
        # Need some IDs to test batch
        # First list accounts to get IDs
        resp = self.client.get(self.base_endpoint)
        if resp.status_code == 200:
            accounts = resp.json()
            if accounts:
                ids = [acc['AccountId'] for acc in accounts[:3]] # Take up to 3
                ids_param = "&".join([f"ids={id}" for id in ids])
                # requests params handling is better
                response = requests.get(f"{self.client.base_url}{self.base_endpoint}batch", params={"ids": ids}, headers=self.client.headers)
                
                if response.status_code == 200:
                    print(f"✅ GET {self.base_endpoint}batch")
                    return True
                else:
                    print(f"❌ GET {self.base_endpoint}batch failed: {response.status_code} - {response.text}")
                    return False
            else:
                print(f"⚠️ GET {self.base_endpoint}batch skipped: No accounts found")
                return True
        else:
            print(f"❌ GET {self.base_endpoint}batch failed to list accounts")
            return False
            
    def test_all(self):
        # Override to include batch test
        if not super().test_all(): return False
        return self.test_batch()

class EmploymentTypesTest(BaseTest):
    def __init__(self, client, account_id):
        super().__init__(client, id_field="EmploymentTypeId")
        self.resource_name = "Employment Types"
        self.base_endpoint = "/api/v1/employment-types/"
        self.account_id = account_id

    def generate_payload(self):
        return {
            "AccountId": self.account_id,
            "Name": fake.job() + " " + str(random.randint(1, 100)),
            "Code": fake.unique.lexify(text='????').upper(),
            "Description": fake.catch_phrase(),
            "IsActive": True
        }

class LeaveTypesTest(BaseTest):
    def __init__(self, client, account_id):
        super().__init__(client, id_field="LeaveTypeId")
        self.resource_name = "Leave Types"
        self.base_endpoint = "/api/v1/leave-types/"
        self.account_id = account_id

    def generate_payload(self):
        return {
            "Name": fake.word().capitalize() + " Leave " + str(random.randint(1, 100)),
            "Code": fake.unique.lexify(text='LT-???').upper(),
            "IsPaid": True,
            "AccruesDuringEmployment": True,
            "IsCumulative": True,
            "HasLeaveLoading": False,
            "IsCashedOutAllowed": False,
            "IsPaidOnTermination": True,
            "AccountId": self.account_id
        }

    def update_payload(self):
        payload = self.generate_payload()
        payload["CountsForAnnualLeaveAccrual"] = True
        return payload

class LeaveTypeRulesTest(BaseTest):
    def __init__(self, client, account_id, leave_type_id, employment_type_id):
        super().__init__(client, id_field="LeaveTypeRuleId")
        self.resource_name = "Leave Type Rules"
        self.base_endpoint = "/api/v1/leave-type-rules/"
        self.account_id = account_id
        self.leave_type_id = leave_type_id
        self.employment_type_id = employment_type_id

    def generate_payload(self):
        return {
            "AccountId": self.account_id,
            "LeaveTypeId": self.leave_type_id,
            "EmploymentTypeId": self.employment_type_id,
            "Code": fake.unique.lexify(text='LTR-????').upper(),
            "Name": "Rule " + fake.word(),
            "AccrualMethod": "continuous",
            "IncludePublicHolidays": False,
            "DeductsOnPublicHoliday": True,
            "EffectiveDate": "2025-01-01",
            "IsActive": True,
            "EntitlementAmount": random.randint(10, 30),
            "AccrualFrequency": "Monthly",
            "CapAmount": 100
        }

def seed_data(client, count=50):
    print(f"\n🌱 Seeding {count} items for each resource...")
    
    # Seed Accounts
    account_ids = []
    print("Seeding Accounts...")
    tester = AccountsTest(client)
    for _ in range(count):
        payload = tester.generate_payload()
        resp = client.post(tester.base_endpoint, payload)
        if resp.status_code in [200, 201]:
            data = resp.json()
            account_ids.append(data.get('AccountId'))
            sys.stdout.write(".")
            sys.stdout.flush()
        else:
            sys.stdout.write("x")
            sys.stdout.flush()
    print(f"\nCreated {len(account_ids)} Accounts")

    # Seed Employment Types
    emp_type_ids = []
    print("\nSeeding Employment Types...")
    for _ in range(count):
        account_id = random.choice(account_ids)
        tester = EmploymentTypesTest(client, account_id)
        payload = tester.generate_payload()
        resp = client.post(tester.base_endpoint, payload)
        if resp.status_code in [200, 201]:
            data = resp.json()
            emp_type_ids.append(data.get('EmploymentTypeId'))
            sys.stdout.write(".")
            sys.stdout.flush()
        else:
            sys.stdout.write("x")
            sys.stdout.flush()
    print(f"\nCreated {len(emp_type_ids)} Employment Types")

    if not account_ids:
        print("❌ No accounts created, skipping Leave Types seeding")
        return

    # Seed Leave Types
    leave_type_ids = []
    print("\nSeeding Leave Types...")
    # Use random account for each leave type
    for _ in range(count):
        account_id = random.choice(account_ids)
        tester = LeaveTypesTest(client, account_id)
        payload = tester.generate_payload()
        resp = client.post(tester.base_endpoint, payload)
        if resp.status_code in [200, 201]:
            data = resp.json()
            leave_type_ids.append(data.get('LeaveTypeId'))
            sys.stdout.write(".")
            sys.stdout.flush()
        else:
            sys.stdout.write("x")
            sys.stdout.flush()
    print(f"\nCreated {len(leave_type_ids)} Leave Types")

    if not leave_type_ids or not emp_type_ids:
        print("❌ Missing dependencies for Leave Type Rules, skipping")
        return

    # Seed Leave Type Rules
    print("\nSeeding Leave Type Rules...")
    for _ in range(count):
        lt_id = random.choice(leave_type_ids)
        et_id = random.choice(emp_type_ids)
        # We need the AccountId for the rule, which should ideally match the LeaveType's account
        # For simplicity in this seed script, we'll just pick a random account or the one from the leave type if we tracked it
        # But we didn't track which account belongs to which leave type in the list.
        # Let's just use a random account for now, assuming cross-account rules might be allowed or not checked strictly for this test
        # OR better: fetch the leave type to get its account. But that's slow.
        # Let's just pick a random account from our created list.
        ac_id = random.choice(account_ids)
        
        tester = LeaveTypeRulesTest(client, ac_id, lt_id, et_id)
        payload = tester.generate_payload()
        resp = client.post(tester.base_endpoint, payload)
        if resp.status_code in [200, 201]:
            sys.stdout.write(".")
            sys.stdout.flush()
        else:
            sys.stdout.write("x")
            sys.stdout.flush()
    print("\nDone seeding!")

def main():
    parser = argparse.ArgumentParser(description="E2E Test and Seeding Script")
    parser.add_argument("--url", default="http://3.107.213.185:8000", help="API Base URL")
    parser.add_argument("--username", default="scott@blueskycreations.com.au", help="Login Username")
    parser.add_argument("--password", help="Login Password")
    parser.add_argument("--token", help="Auth Token (bypass login)")
    parser.add_argument("--test", action="store_true", help="Run E2E Tests")
    parser.add_argument("--seed", action="store_true", help="Seed Data")
    parser.add_argument("--count", type=int, default=50, help="Number of items to seed")

    args = parser.parse_args()

    client = APIClient(args.url, args.username, args.password)
    
    if args.token:
        client.set_token(args.token)
        print("✅ Using provided token")
    elif args.password:
        if not client.login():
            sys.exit(1)
    else:
        print("❌ Either --password or --token must be provided")
        sys.exit(1)

    if args.test:
        # 1. Accounts
        accounts_test = AccountsTest(client)
        if not accounts_test.test_all():
            print("❌ Accounts tests failed")
        
        # Need an account ID for Leave Types
        # Create a temp one or get one
        resp = client.get("/api/v1/accounts/")
        if resp.status_code == 200 and len(resp.json()) > 0:
            account_id = resp.json()[0]['AccountId']
        else:
            # Create one
            account_id = accounts_test.test_create()

        # 2. Employment Types
        emp_test = EmploymentTypesTest(client, account_id)
        if not emp_test.test_all():
            print("❌ Employment Types tests failed")
        
        # Need emp type ID for Rules
        resp = client.get("/api/v1/employment-types/")
        if resp.status_code == 200 and len(resp.json()) > 0:
            emp_type_id = resp.json()[0]['EmploymentTypeId']
        else:
            emp_type_id = emp_test.test_create()

        # 3. Leave Types
        leave_test = LeaveTypesTest(client, account_id)
        if not leave_test.test_all():
            print("❌ Leave Types tests failed")

        # Need leave type ID for Rules
        resp = client.get("/api/v1/leave-types/")
        if resp.status_code == 200 and len(resp.json()) > 0:
            leave_type_id = resp.json()[0]['LeaveTypeId']
        else:
            leave_type_id = leave_test.test_create()

        # 4. Leave Type Rules
        rules_test = LeaveTypeRulesTest(client, account_id, leave_type_id, emp_type_id)
        if not rules_test.test_all():
            print("❌ Leave Type Rules tests failed")

    if args.seed:
        seed_data(client, args.count)

if __name__ == "__main__":
    main()
