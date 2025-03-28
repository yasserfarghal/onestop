import React from 'react'
import {Container ,Row , Col} from 'react-bootstrap'
import {motion} from 'framer-motion'
import TruckLine from 'remixicon-react/TruckLineIcon'
import ExchangeDollarLine from 'remixicon-react/ExchangeDollarLineIcon'
import SecurePaymentLine from 'remixicon-react/SecurePaymentLineIcon'
import RefreshLine from 'remixicon-react/RefreshLineIcon'



function services() {
  return (
    <section className="services">
        <Container>
            <Row>
                <Col md={6} lg={3}>
                    <motion.div whileHover={{scale:1.1}} className="service_item">
                        <span>
                            <TruckLine className='Icon' />
                        </span>
                        <div className="services_desc">
                            <h3>Free Shipping</h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe porro</p>
                        </div>
                    </motion.div>
                </Col>

                <Col md={6} lg={3}>
                    <motion.div whileHover={{scale:1.1}} className="service_item">
                        <span>
                            <RefreshLine className='Icon' />
                        </span>
                        <div className="services_desc">
                            <h3>Easy Returns</h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe porro</p>
                        </div>
                    </motion.div>
                </Col>

                <Col md={6} lg={3}>
                    <motion.div whileHover={{scale:1.1}} className="service_item">
                        <span>
                            <SecurePaymentLine className='Icon' />
                        </span>
                        <div className="services_desc">
                            <h3>Secure Payment</h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe porro</p>
                        </div>
                    </motion.div>
                </Col>

                <Col md={6} lg={3}>
                    <motion.div whileHover={{scale:1.1}} className="service_item">
                        <span>
                            <ExchangeDollarLine className='Icon' />
                        </span>
                        <div className="services_desc">
                            <h3>Back Guaranatee</h3>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe porro</p>
                        </div>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    </section>
  )
}

export default services
