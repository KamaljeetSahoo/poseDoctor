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
						<NavbarBrand href="/" className="mr-auto">reactstrap</NavbarBrand>
						<NavbarToggler onClick={toggleNavbar} className="mr-2" />
						<Collapse isOpen={!collapsed} navbar>
							<Nav navbar>
								<NavItem>
									<NavLink href="/demo">Demo</NavLink>
								</NavItem>
									<UncontrolledDropdown nav inNavbar>
										<DropdownToggle nav caret>
											Exercises
										</DropdownToggle>
										<DropdownMenu right>
											<DropdownItem>
												<NavLink href='/squats'>
													Squats
												</NavLink>
											</DropdownItem>
											<DropdownItem>
												<NavLink href='/handExtension'>
														Hand Extension
												</NavLink>
											</DropdownItem>
											<DropdownItem>
												<NavLink href='/rightHandExtension'>
														Right Hand Extension
												</NavLink>
											</DropdownItem>
											<DropdownItem>
												<NavLink href='/lunges'>
														Lunges
												</NavLink>
											</DropdownItem>
											<DropdownItem>
												<NavLink href='/shoulderExtension'>
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
												<NavLink href='/arom_flexion'>
														AROM Flexion
												</NavLink>
											</DropdownItem>
											<DropdownItem>
												<NavLink href='/arom_lateral_flexion'>
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