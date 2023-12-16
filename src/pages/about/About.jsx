import './about.css'
import image from '../../assets/images/teacher-student.png'

const About = () => {
  return (
    <div className='about'>

      <h1 className='welcomeMessage'>Welcome to unishare</h1>
      <div className='aboutContainer'>
        <div className='aboutContent'>
          <p className='what'>What is Unishare?</p>
          <p className='aboutText'>
          Unishare is a central and standard instructor-student communication system that facilitates the communication between instructors and students. It enables instructors to post important announcements, share resources and give assignments. On the students' side, it enables them to view important announcements and shared resources from their instructors and submit assignments.
        </p>
        <p className='mission'>Mission</p>
        <p>Our mission is to provide university students with Information tailored to their needs.
        </p>
        <p className='join'>
          Join UniShare today and empower yourself for academic success.
        </p>
        <p className='unishare'> <span>Unisahre: </span>Guiding university students towards a brighter future.</p>
        </div>
        <div className='imageContainer'>
          <img src={image} alt="Teacher Student Image" className='image'/>
        </div>
      
      </div>
      


    </div>
  )
}

export default About