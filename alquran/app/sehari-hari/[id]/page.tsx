import { DoaSehariHari } from "@/components/doa-sehari-hari";
import { getUser } from "@/lib/getUser";
import React from "react";

const SehariHariIdPage = async ({ params }: { params: { id: string } }) => {
	const res = await fetch(
		`https://doa-doa-api-ahmadramadhan.fly.dev/api/${params.id}`,
	);
	const data = await res.json();

	const userRes = await getUser()
	const userId = userRes?.logged_in_as?.id

	let doaRes = [];

	if (userId) {
		const doaReq = await fetch(`http://localhost:5000/doa-bookmarks/${userId}`)
		doaRes = await doaReq.json()
		console.log(doaRes)
	}

	return (
		<div>
			<DoaSehariHari data={data} dataBookmarks={doaRes} userId={userId} />
		</div>
	);
};

export default SehariHariIdPage;
