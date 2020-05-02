import { useProperties, useSelectedProperty } from 'client/data'

function PropertySelect() {
  const { property, updateProperty } = useSelectedProperty()

  const { data } = useProperties()

  function handleChange(e) {
    const str = e.target.value
    const property = data!.find((p) => p.id === parseInt(str)) || null
    updateProperty(property)
  }
  return data ? (
    <label
      className="text-sm text-gray-600 font-semibold"
      htmlFor="properties-select flex items-center"
    >
      Property
      <select
        value={property ? property.id : undefined}
        onChange={handleChange}
        className="ml-4"
        name="properties"
        id="properties-select"
      >
        <option>Select property</option>
        {data.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </label>
  ) : null
}

export default PropertySelect
