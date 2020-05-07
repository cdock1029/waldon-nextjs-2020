import { useProperties, useSelectedProperty } from 'client'
import { Menu, MenuButton, MenuList, MenuItem } from '@reach/menu-button'

function PropertySelect() {
  const { property, updateProperty } = useSelectedProperty()
  const { data } = useProperties()
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
        {data &&
          data.map((p) => {
            return (
              <MenuItem onSelect={() => updateProperty(p)} key={p.id}>
                {p.name}
              </MenuItem>
            )
          })}
      </MenuList>
    </Menu>
  )
}

export default PropertySelect
