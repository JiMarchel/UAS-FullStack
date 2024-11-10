"use server"

import { getUser } from "@/lib/getUser"
import { cookies } from "next/headers"

export const doaBookmark = async (doaId: number) => {
	const cookie = cookies()
	const access_token = cookie.get("access_token")

	const userRes = await getUser()
	const userId = userRes.logged_in_as.id

	const body = {
		user_id: userId,
		doa_id: doaId
	}

	console.log(body)

	const bookmark = await fetch("http://localhost:5000/doa-bookmarks", {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${access_token?.value}`
		}
	})

	const resbok = await bookmark.json()
	console.log(resbok)
	return resbok
}
