// TODO: Create an interface for the Candidate objects returned by the API
export default interface Candidate {
    readonly id: number | null;
    readonly login: string | null;
    readonly avatar_url: string | null;
    readonly name: string | null;
    readonly location: string | null;
    readonly email: string | null;
    readonly company: string | null;
    readonly bio: string | null;
}