export interface MembershipRequestInterface {
    id: number;
    userID?: number;
    pharmacyID?: number;
    sendDate?: string;
    acceptDate?: string;
    accepted: boolean;
    acceptedString?: string;
    userComment?: string;
    pharmacyComment: string;
}
