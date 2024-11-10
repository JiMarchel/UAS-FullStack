"use server"

import { getUser } from "@/lib/getUser"
import { cookies } from "next/headers"

export const alquranBookmark = async (alquranId: number) => {
	const cookie = cookies()
	const access_token = cookie.get("access_token")

	const userRes = await getUser()
	const userId = userRes.logged_in_as.id

	const body = {
		user_id: userId,
		alquran_id: alquranId
	}

	const bookmark = await fetch("http://localhost:5000/alquran-bookmarks", {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${access_token?.value}`
		}
	})

	const resbok = await bookmark.json()
	return resbok
}
