import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerSubtitle,
  DrawerContent,
  List,
  ListItem,
  DrawerAppContent,
  TopAppBar,
  TopAppBarRow,
  TopAppBarSection,
  TopAppBarTitle,
  TopAppBarFixedAdjust,
  TopAppBarNavigationIcon,
  Card,
  Select,
} from 'rmwc/dist'
import Link from 'next/link'
import { useOpen } from 'client'

export function Layout({ children, ...rest }: { children: React.ReactNode }) {
  const [open, updateOpen] = useOpen()

  function toggle() {
    if (updateOpen && typeof updateOpen === 'function') {
      updateOpen(!open)
    }
  }

  return (
    <div
      className="h-screen max-h-screen overflow-hidden relative"
      id="page"
      {...rest}
    >
      <Drawer dismissible open={!!open}>
        <DrawerHeader>
          <DrawerTitle>Waldon Mgmt.</DrawerTitle>
          <DrawerSubtitle>111 Westchester Dr</DrawerSubtitle>
        </DrawerHeader>
        <DrawerContent>
          <List>
            <Link href="/">
              <ListItem as="a" ripple>
                Home
              </ListItem>
            </Link>
            <Link href="/units">
              <ListItem as="a" ripple>
                Units
              </ListItem>
            </Link>
            <Link href="/tenants">
              <ListItem tag="a" ripple>
                Tenants
              </ListItem>
            </Link>
          </List>
        </DrawerContent>
      </Drawer>

      {/* Optional DrawerAppContent */}
      <DrawerAppContent className="app-content h-full max-h-full overflow-y-auto">
        <TopAppBar fixed>
          <TopAppBarRow>
            <TopAppBarSection>
              <TopAppBarNavigationIcon onClick={toggle} icon="menu" />
              <Link href="/">
                <TopAppBarTitle tag="a" className="cursor-pointer">
                  Waldon
                </TopAppBarTitle>
              </Link>
            </TopAppBarSection>
            <TopAppBarSection alignEnd>
              <Select
                label="Standard"
                options={['Cookies', 'Pizza', 'Icecream']}
              />
            </TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>
        <TopAppBarFixedAdjust />
        <main className="p-8 max-w-screen-lg w-full mx-auto">
          <Card className="p-4">{children}</Card>
        </main>
      </DrawerAppContent>
      <style jsx>{`
        & :global(.mdc-drawer) {
          background-color: var(--mdc-theme-surface);
        }
      `}</style>
    </div>
  )
}
