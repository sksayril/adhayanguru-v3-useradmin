import { redirect } from 'next/navigation';

export default function RootLoginPage() {
  redirect('/user/login');
}
