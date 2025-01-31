export class CreateUserDto {
    name: string;
    email: string;
    gender: 'Male' | 'Female' | 'Other';
}
