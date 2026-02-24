import { redirect } from 'next/navigation'

export default function RedirectToUnifiedListings() {
    redirect('/admin/listings')
}
