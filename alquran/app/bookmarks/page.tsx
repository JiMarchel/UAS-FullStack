import { ListDoaSehariHari } from "@/components/list-doa-sehari-hari"
import { ListSuratAlQuran } from "@/components/list-surat-alquran"
import { Separator } from "@/components/ui/separator"
import { getUser } from "@/lib/getUser"
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

	const res = await fetch("https://api.npoint.io/99c279bb173a6e28359c/data");
	const data = await res.json();

	const userRes = await getUser()
	const userId = userRes?.logged_in_as?.id

	let alquranRes = []
	let doaRes = []

	if (userId) {
		const alquranReq = await fetch(`http://localhost:5000/alquran-bookmarks/${userId}`, { next: { revalidate: 0 } })
		alquranRes = await alquranReq.json()
		const doaReq = await fetch(`http://localhost:5000/doa-bookmarks/${userId}`, { next: { revalidate: 0 } })
		doaRes = await doaReq.json()
	} else {
		redirect("/login")
	}

	const alquran_id = alquranRes.map((v: any) => v.alquran_id)
	const filteredData = data.filter((v: any) => alquran_id.includes(parseInt(v.nomor)))

	const resDoa = await fetch("https://doa-doa-api-ahmadramadhan.fly.dev/api");
	const dataDoa = await resDoa.json();

	const doa_id = doaRes.map((v: any) => v.doa_id)
	const filteredDoaData = dataDoa.filter((v: any) => doa_id.includes(parseInt(v.id)))
	return (
		<div >
			<ListSuratAlQuran data={filteredData} />
			<Separator className="max-w-[400px] mx-auto my-10 sm:max-w-[800px]" />
			<ListDoaSehariHari data={filteredDoaData} />
		</div>
	)
}

export default BookMarks
