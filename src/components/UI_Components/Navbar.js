import React, {useState} from 'react'
import { Collapse, Container, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';

const NavbarComp = () => {
	const [collapsed, setCollapsed] = useState(true)
	function toggleNavbar() {
		setCollapsed(!collapsed)
	}
	return (
		<div>
			<div>
        <Navbar color="faded" light>
					<Container>
						<NavbarBrand href="/poseDoctor" className="mr-auto" style={{fontFamily: 'Monoton', fontSize:'40px'}}>PoseDoc</NavbarBrand>
						<NavbarToggler onClick={toggleNavbar} className="mr-2" />
						<Collapse isOpen={!collapsed} navbar>
							<Nav navbar>
								<NavItem>
									<NavLink href="/poseDoctor/demo">Demo</NavLink>
								</NavItem>
									<UncontrolledDropdown nav inNavbar>
										<DropdownToggle nav caret>
											Exercises
										</DropdownToggle>
										<DropdownMenu right>
											<DropdownItem>
												<NavLink href='/poseDoctor/squats'>
													Squats
												</NavLink>
											</DropdownItem>
											<DropdownItem>
												<NavLink href='/poseDoctor/handExtension'>
														Hand Extension
												</NavLink>
											</DropdownItem>
											<DropdownItem>
												<NavLink href='/poseDoctor/rightHandExtension'>
														Right Hand Extension
												</NavLink>
											</DropdownItem>
											<DropdownItem>
												<NavLink href='/poseDoctor/lunges'>
														Lunges
												</NavLink>
											</DropdownItem>
											<DropdownItem>
												<NavLink href='/poseDoctor/shoulderExtension'>
														Shoulder Extension
												</NavLink>
											</DropdownItem>
										</DropdownMenu>
									</UncontrolledDropdown>
									<UncontrolledDropdown nav inNavbar>
										<DropdownToggle nav caret>
											AROM
										</DropdownToggle>
										<DropdownMenu right>
											<DropdownItem>
												<NavLink href='/poseDoctor/arom_flexion'>
														AROM Flexion
												</NavLink>
											</DropdownItem>
											<DropdownItem>
												<NavLink href='/poseDoctor/arom_lateral_flexion'>
														AROM Lateral Flexion
												</NavLink>
											</DropdownItem>
										</DropdownMenu>
									</UncontrolledDropdown>
							</Nav>
						</Collapse>
					</Container>
        </Navbar>
      </div>
		</div>
	)
}

export default NavbarComp