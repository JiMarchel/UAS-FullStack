"use client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "@/action/loginAction"
import { useFormState } from "react-dom"

const initialState = {
	message: '',
}
export function LoginForm() {
	const [state, formAction] = useFormState(loginAction, initialState)

	return (
		<Card className="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>
					Enter your username below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="grid gap-4" action={formAction}>
					<div className="grid gap-2">
						<Label htmlFor="username">username</Label>
						<Input
							id="username"
							type="username"
							placeholder="username"
							required
							name="username"
						/>
					</div>
					<div className="grid gap-2">
						<div className="flex items-center">
							<Label htmlFor="password">Password</Label>
						</div>
						<Input id="password" type="password" required placeholder="password"
							name="password"
						/>
					</div>
					<p aria-live="polite" className="text-red-500">{state?.message}</p>
					<Button type="submit" className="w-full">
						Login
					</Button>
				</form>
				<div className="mt-4 text-center text-sm">
					Don&apos;t have an account?{" "}
					<Link href="/register" className="underline">
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
