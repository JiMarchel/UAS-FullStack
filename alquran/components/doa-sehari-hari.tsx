"use client"
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { BookmarkIcon, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { doaBookmark } from "@/action/doaBookmarkAction";

interface ListDoa {
	id: string;
	doa: string;
	ayat: string;
	latin: string;
	artinya: string;
}

interface ListDoaId {
	doa_id: number;
	id: number;
	user_id: number;
}

interface ListDoaProps {
	data: ListDoa[];
	dataBookmarks: ListDoaId[],
	userId: string
}

export const DoaSehariHari = ({ userId, dataBookmarks, data }: ListDoaProps) => {
	const pathName = usePathname()
	const doaId = pathName.split("/").pop()!
	const router = useRouter()

	const currentBookmark = dataBookmarks.find(v => v.doa_id === parseInt(doaId))

	const [isBookmarked, setIsBookmarked] = useState(currentBookmark !== undefined);

	const handleBookmarkToggle = async () => {
		if (!userId) {
			router.push("/login")
			return
		}
		const toggle = await doaBookmark(parseInt(doaId));
		toast.success(`${toggle.message}`);
		setIsBookmarked(!isBookmarked);
	};

	return (
		<div className="max-w-[400px] mx-auto mt-8 space-y-4 px-2 sm:max-w-[800px]">
			<div className="flex justify-between items-center">
				<Link
					href="/sehari-hari"
					className="font-medium mb-16 text-xl text-primary  flex items-end"
				>
					<ChevronLeft />
					Back
				</Link>

				<Button size="icon" variant={isBookmarked ? "default" : "outline"} onClick={handleBookmarkToggle}
				><BookmarkIcon /></Button>
			</div>
			{data.map((v) => (
				<Card
					key={v.id}
				>
					<CardHeader className="space-y-16">
						<CardTitle className="text-center">{v.doa}</CardTitle>
						<CardTitle className="text-end leading-relaxed">{v.ayat}</CardTitle>
					</CardHeader>

					<CardContent className="grid gap-4">
						<p className="font-bold">{v.latin}</p>
						<p>{v.artinya}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
};
