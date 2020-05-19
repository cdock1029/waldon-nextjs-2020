import { useSelectedProperty } from 'client'
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button'

function PropertySelect({ properties }: { properties: Property[] }) {
  const { property, updateProperty } = useSelectedProperty()
  return (
    <Menu>
      <MenuButton>
        {property ? property.name : 'Select property'}{' '}
        <span aria-hidden>▾</span>
      </MenuButton>
      <MenuList>
        {property ? (
          <MenuItem onSelect={() => updateProperty(null)}>
            Clear selection
          </MenuItem>
        ) : null}
        {properties &&
          properties.map((p) => (
            <MenuItem onSelect={() => updateProperty(p)} key={p.id}>
              {p.name}
            </MenuItem>
          ))}
      </MenuList>
    </Menu>
  )
}

export default PropertySelect
