import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { toast } from "sonner"

const BookMarks = async () => {
	const userCookies = cookies()
	const access_token = userCookies.get("access_token")
	if (!access_token) {
		() => {
			toast("Youre not logged in", {
				description: "Please login first"
			})
		}
		redirect("/login")
	}
	// const userData = {
	// 	username: "jimmy",
	// 	password: "apem2181"
	// };
	return (
		<div className="max-w-[400px] mx-auto grid gap-2 px-2 sm:max-w-[800px]">test</div>
	)
}

export default BookMarks
