export interface IImage {
	id: string;
	uri: string;
}

//the currently selected user (not the logged in user)
export interface UserEntity {
	displayName: string;
	email: string;
	uid: string;
	photoURL: string;
}

//the Currently logged in user
export interface AuthEntity {
	uid: string;
	displayName: string;
	photoURL?: string;
	login: boolean;
	language: string;
	email: string;
}

// a chat message (to match gifted chat)
export interface MessageEntity {
	_id: string;
	createdAt: any;
	text: string;
	user: {
		_id: string;
		name: string;
		email: string;
	};
}

// a domain entity (typically selected domain)
export interface DomainEntity {
	node: string;
	name: string;
}

export interface StoryEntity {
	key: string;
	photo1?: string;
	summary: string;
	summaryMyLanguage: string;
	descriptionMyLanguage: string;
	description: string;
	visible: boolean;
	showIconChat: boolean;
	order: number;
	date_start: string;
	time_start_pretty: string;
	time_end_pretty: string;
	source?: any;
	dateTimeStart?: any;
	dateTimeEnd?: any;
	location?: any;
	scroll?: boolean;
	newState?: any;
}

export interface StoryState extends StoryEntity {
	cameraIcon: string;
	edit: boolean;
	domain: string;
}
