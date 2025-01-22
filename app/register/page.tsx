"use client"

export default function Register(){

    const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
    }

    return(
        <>
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-4">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-4">

                </form>
            </div>
        </>
    )
}