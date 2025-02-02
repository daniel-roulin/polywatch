// import Breadcrumbs from "@/ui/breadcrumbs";
import ProfileCard from "@/ui/profile";
import Plan from "@/ui/plan";
import Timetable from "@/ui/timetable";

export default async function Page() {
    return (
        // min-h-screen overflow-auto
        <main className="flex flex-col">
            {/* <Breadcrumbs/> */}
            <div className="flex">
                <ProfileCard
                    name="Daniel Roulin"
                    section="MT"
                    semester="BA3"
                    email="daniel.roulin@epfl.ch"
                    peoplePageUrl="https://people.epfl.ch/daniel.roulin"
                    // profileImage="/daniel-roulin.jpg"
                />
                <Plan />
            </div>
            <Timetable />
        </main>
    );
}