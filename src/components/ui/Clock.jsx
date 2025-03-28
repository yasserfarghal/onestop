import React from 'react'

const Clock = () => {
    const [days , setDays] = React.useState()
    const [hours , setHours] = React.useState()
    const [min , setMin] = React.useState()
    const [sec , setSec] = React.useState()

    let interval;
    const countDown = () => {
        const destination = new Date('9/8/2023').getTime()

        interval = setInterval (()=>{
            const nowDay = new Date().getTime()
            const differentsDays = destination - nowDay
            const daysLeft = Math.floor(differentsDays / (1000 * 60 * 60 * 24))
            const hoursLeft = Math.floor(differentsDays % (1000 * 60 * 60 *24) / (1000 * 60 * 60))
            const MinLeft = Math.floor(differentsDays % (1000 * 60 * 60) / (1000 * 60))
            const secLeft = Math.floor(differentsDays % (1000 * 60) / 1000)

            if(destination < 0) {
                clearInterval(interval.current)
            }else{
                setDays(daysLeft)
                setHours(hoursLeft)
                setMin(MinLeft)
                setSec(secLeft)
            }
        })

        
    }
    
    React.useEffect(()=> countDown,[])
    

  return (
    <div className='clock_wrapper d-flex align-items-center gap-5'>
        
        <div className="clock_data d-flex align-items-center gap-5">
            <div className='text-center'>
                <h1>{days}</h1>
                <h5>Days</h5>
            </div>
            <span>:</span>
        </div>

        <div className="clock_data d-flex align-items-center gap-5">
        <div className='text-center'>
                <h1>{hours}</h1>
                <h5>Hours</h5>
            </div>
            <span>:</span>
        </div>

        <div className="clock_data d-flex align-items-center gap-5">
        <div className='text-center'>
                <h1>{min}</h1>
                <h5>Minutes</h5>
            </div>
            <span>:</span>
        </div>

        <div className="clock_data d-flex align-items-center gap-5">
        <div className='text-center'>
                <h1>{sec}</h1>
                <h5>Secounds</h5>
            </div>
        </div>
    </div>
  )
}

export default Clock
