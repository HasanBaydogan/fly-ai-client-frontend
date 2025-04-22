// Models for PI Comments

export interface UserComment {
  id?: string;
  comment: string;
  severity: string;
  createdAt?: string;
}

export interface PiUserComment extends UserComment {
  isNew?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
}
