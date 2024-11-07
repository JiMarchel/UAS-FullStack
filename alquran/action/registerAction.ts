"use server"

import { redirect } from "next/navigation"


export const registerAction = async (prevState: any, formData: FormData) => {
	const body = {
		username: formData.get("username"),
		password: formData.get("password")
	}

	const response = await fetch("http://127.0.0.1:5000/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	})

	if (!response.ok) {
		const errRes = await response.json()
		return { message: errRes.message }
	}

	redirect("/login")
}
