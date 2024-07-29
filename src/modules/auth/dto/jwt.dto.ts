export interface JwtDto {
  userId: number;
  /**
   * Issued at
   */
  iat: number;
  /**
   * Expiration time
   */
  exp: number;
  isDesigner: boolean;
}

export interface JwtInput {
  userId: number;
}
