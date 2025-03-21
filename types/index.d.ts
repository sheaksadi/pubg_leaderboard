export interface User {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    banner: string | null;
    accent_color: number | null;
    global_name: string;
    avatar_decoration_data: string | null;
    banner_color: string | null;
    clan: string | null;
    primary_guild: string | null;
    mfa_enabled: boolean;
    locale: string;
    premium_type: number;
    email: string;
    verified: boolean;
}

export interface SessionData {
    user?: User | null;
}


// src/types/index.ts


export interface Session {
    user: User;
    token: string;
    expiresAt: number;
    avatar: string;
    username: string;
}

// Navigation types
export interface NavItem {
    label: string;
    href: string;
}

// Search types
export interface SearchItem {
    id: string;
    name: string;
    type: 'player' | 'team' | 'tournament';
}

// Contribution data
export interface ContributionData {
    date: string;
    contributions: number;
}

// Animation types
export interface Position {
    top: number;
    left: number;
}

// Particle types
export interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    alpha: number;
    growthRate: number;
}

export interface Role {
    name: string;
    id: string;
    color: string;
}

export interface DiscordUser {
    name: string;
    id: string;
    username: string;
    roles: Role[];
    avtar: string;
}

export interface Member {
    memberId: number;
    discordId: string;
    playerId: string | null;
    playerName: string | null;
    nickname: string;
}

