import { User } from "@core";

export function areFriends( user1: User, user2: User ) {
    return user1.friends.includes( user2.id ) &&
        user2.friends.includes( user1.id );
}
