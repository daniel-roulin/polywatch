import { helloWorld } from "@/lib/test";

export default async function HelloWorld() {
    return (
        <h3>{helloWorld()}</h3>
    );
}