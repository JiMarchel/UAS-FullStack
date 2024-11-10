"use client"
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { convertToArabicNumber } from "@/lib/convert-number-arabic";
import Link from "next/link";
import { BookmarkIcon, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { alquranBookmark } from "@/action/alquranBookmarkAction";
import { toast } from "sonner";

interface ListAyat {
	ar: string;
	id: string;
	tr: string;
	nomor: string;
}

interface ListAlquranId {
	alquran_id: number;
	id: number;
	user_id: number;
}

interface ListAyatProps {
	data: ListAyat[];
	dataBookmarks: ListAlquranId[]
	userId: string
}

export const ListAyat = ({ data, dataBookmarks, userId }: ListAyatProps) => {
	const pathName = usePathname()
	const alquranId = pathName.split("/").pop()!
	const router = useRouter()

	const currentBookmark = dataBookmarks.find(v => v.alquran_id === parseInt(alquranId));

	const [isBookmarked, setIsBookmarked] = useState(currentBookmark !== undefined);

	const handleBookmarkToggle = async () => {
		if (!userId) {
			router.push("/login")
			return
		}
		const toggle = await alquranBookmark(parseInt(alquranId));
		toast.success(`${toggle.message}`);
		setIsBookmarked(!isBookmarked);
	};

	return (
		<div className="max-w-[400px] space-y-2 mx-auto overflow-hidden px-2 sm:max-w-[800px] ">
			<div className="flex justify-between items-center">
				<Link
					href="/al-quran"
					className=" font-medium text-xl text-primary flex items-end "
				>
					<ChevronLeft />
					Back
				</Link>


				<Button size="icon" variant={isBookmarked ? "default" : "outline"} onClick={handleBookmarkToggle}
				><BookmarkIcon /></Button>
			</div>
			<div className="my-8">
				<h1 className="text-center text-3xl font-bold my-16 ">
					بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
				</h1>
			</div>
			{data.map((e) => (
				<Card
					className=""
					key={e.nomor}
				>
					<CardHeader className="flex flex-row items-start justify-between">
						<CardTitle className="text-start pr-5">
							{convertToArabicNumber(parseInt(e.nomor))}
						</CardTitle>
						<CardTitle className="leading-relaxed text-end">{e.ar}</CardTitle>
					</CardHeader>

					<CardContent className="grid gap-4">
						<p
							className="font-bold"
							dangerouslySetInnerHTML={{ __html: e.tr }}
						></p>
						<p>{e.id}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
};
