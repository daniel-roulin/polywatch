import Image from "next/image";
import Link from "next/link";
import OpenInNewIcon from "./icons";

type ProfileCardProps = {
    name: string;
    section: string;
    semester: string;
    email: string;
    peoplePageUrl: string;
    profileImage?: string;
};

export default function ProfileCard({
    name,
    section,
    semester,
    email,
    peoplePageUrl,
    profileImage,
}: ProfileCardProps) {
    return (
        <div className="w-1/2 m-8 flex items-center">
            <div className="h-full aspect-square bg-blue-500"></div>
            <div className="ml-4 flex flex-col gap-2 items-start ">
                <h2 className="text-2xl font-bold">
                    {name}
                </h2>
                <Link href="#" className="text-xl font-normal hover:underline hover:text-red-1">
                    <p>{section} - {semester}</p>
                </Link>
                <Link href="#" className="text-xl font-normal hover:underline hover:text-red-1">
                    <p>{email}</p>
                </Link>
                <Link href="#" className="flex items-end text-xl font-extrabold bg-red-1 hover:bg-red-2 text-white py-1 px-2 rounded-lg">
                    <span>Open people page</span>
                    <OpenInNewIcon className="ml-1 my-1 w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
