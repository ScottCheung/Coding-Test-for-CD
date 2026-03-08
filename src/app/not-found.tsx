import Link from "next/link"
import { Button } from "@/components/UI/Button"
import { H1, H2, P } from "@/components/UI/text/typography"

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-page text-center dark:bg-background-dark">
            <H1 className="text-primary">404</H1>
            <H2 className="mt-4 text-primary">
                Page Not Found
            </H2>
            <P className="mt-2 text-ink-secondary dark:text-gray-400">
                The page you are looking for doesn't exist or has been moved.
            </P>
            <div className="mt-8">
                <Button asChild>
                    <Link href="/dashboard">Go back home</Link>
                </Button>
            </div>
        </div>
    )
}
