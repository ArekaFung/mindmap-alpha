import { useNavigate } from 'react-router-dom'
import { useEventActionStore } from '~/store/eventActionStore'

import '~/assets/css/AboutMePage.scss'

import AREKA_SELFIE from '~/assets/images/areka_selfie.jpeg'
import ROADMAP from '~/assets/images/roadmap.jpeg'
import frontendIcon from '~/assets/images/frontend.png'
import pastexpIcon from '~/assets/images/pastexp.png'
import mindIcon from '~/assets/images/mind.png'
import clickmeIcon from '~/assets/images/clickme.png'

import linkedinIcon from '~/assets/images/linkedin.svg'
import githubIcon from '~/assets/images/github.svg'
import instagramIcon from '~/assets/images/instagram.svg'

const AboutMePage = () => {
    const setAction = useEventActionStore(state => state.setAction)
    const navigate = useNavigate();

    return (
        <div className='about-container'>
            <div className='intro-section'>
                <div className='intro-section-left'>
                    <span className='welcome'>Hello, Welcome</span>
                    <span className='name'> I'm Areka Fung</span>
                    <div className='description-wrapper'>
                        <span className='description'>
                            I am a passionate programmer and explorer. With a
                            strong analytical mindset and being a proactive
                            listener, I possess exceptional problem-solving skills
                            that enable me to effectively communicate with
                            different stakeholders and deliver satisfactory
                            products consistently as a team-player.
                            I also identify myself as a quick learner and critical
                            thinker who is logical, detail minded and confident
                            in nature.
                        </span>
                    </div>
                    <div className='contact-list'>
                        <a target='_blank' href="https://www.linkedin.com/in/areka-fung-78b0702b0/" ><img className='icon' src={linkedinIcon} /></a>
                        <a target='_blank' href="https://github.com/ArekaFung" ><img className='icon' src={githubIcon} /></a>
                        <a target='_blank' href="https://www.instagram.com/areka.forsure" ><img className='icon' src={instagramIcon} /></a>
                    </div>
                    <div style={{ position: "relative" }}>
                        <div className='letgo-btn'>
                            <span className='text' onClick={() => {
                                setAction(null, 'load user data', null, 'Maintain')
                                navigate('/mind-map')
                            }}>Let's Map!</span>
                        </div>
                        <img style={{ position: "absolute", bottom: "-40px", left: "165px" }} className="icon" src={clickmeIcon} />
                    </div>
                </div>
                <div className='intro-section-right'>
                    <div className='picture-wrapper'>
                        <img className='picture' src={AREKA_SELFIE} />
                    </div>
                </div>
            </div>
            <div className='skillset-container'>
                <span className='title-color'>Something<span className='title-raw'>about ME</span></span>
                <div className='box-wrapper'>
                    <div className='box'>
                        <img className="icon" src={frontendIcon} />
                        <span className='header'>
                            Programming
                        </span>
                        <span className='description'>
                            - Java C# Python
                        </span>
                        <span className='description'>
                            - MSSQL MySQL
                        </span>
                        <span className='description'>
                            - NodeJS ReactJS TypeScript
                        </span>
                        <span className='description'>
                            - SpringBoot ASP.Net
                        </span>
                        <span className='description'>
                            - HTML JavaScript CSS
                        </span>
                    </div>
                    <div className='box'>
                        <img className="icon" src={pastexpIcon} />
                        <span className='header'>
                            Past Experience
                        </span>
                        <span className='description'>
                            - eCommerce Website
                            <br />
                            <span className='details'>
                                Online shopping platform with payment gateway integration.
                            </span>
                        </span>
                        <span className='description'>
                            - iAMSmart Integrations
                            <br />
                            <span className='details'>
                                Implementing and upgrading for Transport Department's existing public facing websites
                            </span>
                        </span>
                        <span className='description'>
                            - Transport Department Permit Systems
                            <br />
                            <span className='details'>
                                Full-stack website for both Public-facing and Internal admin
                            </span>
                        </span>
                        <span className='description'>
                            - Mind-mapping tool
                            <br />
                            <span className='details'>
                                Heads up and find out more!!
                            </span>
                        </span>
                    </div>
                    <div className='box'>
                        <img className="icon" src={mindIcon} />
                        <span className='header'>
                            Character
                        </span>
                        <span className='description'>
                            - Analytical Mindset
                        </span>
                        <span className='description'>
                            - High Adaptability and Independent
                        </span>
                        <span className='description'>
                            - Patience and Perseverance
                        </span>
                        <span className='description'>
                            - Lv. 27
                        </span>
                    </div>
                </div>
            </div>
            <div className='roadmap-container'>
                <span className='title-raw'>ROAD<span className='title-color'>MAP</span></span>
                <img className='roadmap-banner' src={ROADMAP} />
            </div>
        </div>
    )
}

export default AboutMePage