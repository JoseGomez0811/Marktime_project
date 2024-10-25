import {useEffect,useState} from "react"
import { getUser } from "../../firebase/users-service"

export function useGetUser(){
    const [user, setUser] = useState([])
    const [find, setFind] = useState("")

    const getUsers = async () => {
        const users = await getUser()
        setUser(users)
    }

    const findUsers = async () => {
        if(find !== ""){
            const users = await getUser()
            const userss = users.filter((userss) => userss.name.toLowerCase().includes(find.toLowerCase()))
            if (userss.length === 0){
                return false
            }
            setUser(userss)
            return true
        }else{
            const users = await getUser()
            setUser(users)
            return false
        }
    }

    useEffect(()=>{
        getUser()
    },[])

    return{
        users, 
        findUsers,
        setFind,
        find
    }

}