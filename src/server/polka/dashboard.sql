select
  distinct on(lease.unit_id) unit.name unit,
  string_agg(tenant.full_name, ',') over (partition by lease_tenant.lease_id) tenant,
  lease.*
from lease
join unit on unit.id = lease.unit_id
join lease_tenant on lease_tenant.lease_id = lease.id
join tenant on tenant.id = lease_tenant.tenant_id
where
  unit.property_id = $[propertyId]
order by
  lease.unit_id,
  lease.start_date desc
limit
  $[limit] offset $[offset]