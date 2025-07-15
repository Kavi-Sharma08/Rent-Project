
interface Props{
    params : {
        id : string
    }
}
export default async function UserPage({params} : Props) {
    const {id} = await params
    

    return (
        <div className="text-6xl text-white">
            {id}
        </div>
    )
}