import React, {useState} from 'react'
import { Collapse, Container, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

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
									<NavLink href="/squats/">Components</NavLink>
								</NavItem>
								<NavItem>
									<NavLink href="/armextension/">Components</NavLink>
								</NavItem>
								<NavItem>
									<NavLink href="/components/">Components</NavLink>
								</NavItem>
								<NavItem>
									<NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
								</NavItem>
							</Nav>
						</Collapse>
					</Container>
        </Navbar>
      </div>
		</div>
	)
}

export default NavbarComp