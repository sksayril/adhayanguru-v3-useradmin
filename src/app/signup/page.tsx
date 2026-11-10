import { redirect } from 'next/navigation';

export default function RootSignupPage() {
  redirect('/user/signup');
}
