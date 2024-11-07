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
import { useFormState } from "react-dom"
import { registerAction } from "@/action/registerAction"

const initialState = {
	message: '',
}
export function RegisterForm() {
	const [state, formAction] = useFormState(registerAction, initialState)

	return (
		<Card className="mx-auto w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Register</CardTitle>
				<CardDescription>
					Fill out the form bellow to register
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
						Register
					</Button>
				</form>
				<div className="mt-4 text-center text-sm">
					Already have an account?{" "}
					<Link href="/login" className="underline">
						Login
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
