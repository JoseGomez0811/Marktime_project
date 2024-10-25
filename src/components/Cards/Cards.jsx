import styles from "./Cards.module.css";

export function Cards(Props){

    let name, position, status;

    try{
        name = Props.user.name
        position = Props.user.position
        status = Props.user.status
    }catch{
        console.log("ERROR")
        name = "Error"
        position = "Error"
        status = "Error"
    }

    return(
        <div className={styles.userCard}
            onClick={() => setSelectedUser(user)}
        >
            <h3 className={styles.userName}>{name}</h3>
            <p className={styles.userPosition}>{position}</p>
            <p className={user.userStatus}>{status}</p>
        </div>
    )
}