
import AccountProfile from "@/components/form/AccountProfile";
import { currentUser } from "@clerk/nextjs";
import OnBoardingSection from '@/components/onboarding/OnBoardingSection';
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from 'next/navigation';

async function Page(){

    const user = await currentUser();

    if (!user) return null;

    const userInfo = await fetchUser(user.id);

    if (userInfo?.onboarded)
    {
        redirect('/');
    }
    

    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo?.username || user?.username,
        name: userInfo?.name || user?.firstName || "",
        bio: userInfo?.bio || "",
        image: userInfo?.image || user?.imageUrl
    };

    return(
        <main className="mx-auto flex max-w-2xl flex-col justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-1">
                    Welcome aboard! Complete your profile to enter the world of Ota.
            </p>
            <OnBoardingSection>
                <AccountProfile user={userData} btnTitle="Continue" />
            </OnBoardingSection>
        </main>
    )
}

export default Page;