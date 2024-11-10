import { ListAyat } from "@/components/list-ayat-alquran";
import { getUser } from "@/lib/getUser";
import React from "react";

const SuratNomerPage = async ({ params }: { params: { nomer: string } }) => {
	const res = await fetch(
		`https://api.npoint.io/99c279bb173a6e28359c/surat/${params.nomer}`,
	);
	const data = await res.json();

	const userRes = await getUser();
	const userId = userRes?.logged_in_as?.id;  // Gunakan optional chaining

	let alquranRes = [];

	if (userId) {
		const alquranReq = await fetch(`http://localhost:5000/alquran-bookmarks/${userId}`);
		alquranRes = await alquranReq.json();
	}

	return (
		<div>
			<ListAyat data={data} dataBookmarks={alquranRes} userId={userId} />
		</div>
	);
};

export default SuratNomerPage;

