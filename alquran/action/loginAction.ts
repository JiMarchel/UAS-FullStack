"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"


export const loginAction = async (prevState: any, formData: FormData) => {
	const body = {
		username: formData.get("username"),
		password: formData.get("password")
	}

	const userCookies = cookies()
	const response = await fetch("http://127.0.0.1:5000/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body)
	})

	if (!response.ok) {
		return { message: "Wrong username or password" }
	}

	const responseData = await response.json();
	const oneDay = 24 * 60 * 60 * 1000
	userCookies.set("access_token", responseData.access_token, { maxAge: oneDay, path: "/" })
	redirect("/bookmarks")
}
