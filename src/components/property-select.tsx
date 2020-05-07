import { useProperties, useSelectedProperty } from 'client'
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button'

function PropertySelect() {
  const { property, updateProperty } = useSelectedProperty()
  const { data } = useProperties()
  return data ? (
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
        {data.map((p) => {
          return (
            <MenuItem onSelect={() => updateProperty(p)} key={p.id}>
              {p.name}
            </MenuItem>
          )
        })}
      </MenuList>
    </Menu>
  ) : null
}

export default PropertySelect
