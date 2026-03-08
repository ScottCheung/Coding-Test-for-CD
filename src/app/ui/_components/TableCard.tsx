import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/UI/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/UI/table';

export function TableCard() {
    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Table</CardTitle>
                <CardDescription>
                    Data display in rows and columns.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">INV-001</TableCell>
                            <TableCell>Paid</TableCell>
                            <TableCell>Credit Card</TableCell>
                            <TableCell className="text-right">$250.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">INV-002</TableCell>
                            <TableCell>Pending</TableCell>
                            <TableCell>PayPal</TableCell>
                            <TableCell className="text-right">$150.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">INV-003</TableCell>
                            <TableCell>Unpaid</TableCell>
                            <TableCell>Bank Transfer</TableCell>
                            <TableCell className="text-right">$350.00</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
