import { cookies } from "next/headers"

export const getUser = async () => {
	const cookie = cookies()
	const access_token = cookie.get("access_token")

	const user = await fetch("http://localhost:5000/protected", {
		headers: {
			"Authorization": `Bearer ${access_token?.value}`
		}
	})

	const userRes = await user.json()

	return userRes
}
