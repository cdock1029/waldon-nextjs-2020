select distinct on(lease.unit_id) unit.name unit,
  string_agg(tenant.full_name, ',') over (partition by lease_tenant.lease_id) tenant,
  lease.*
from lease
  join unit on unit.id = lease.unit_id
  join lease_tenant on lease_tenant.lease_id = lease.id
  join tenant on tenant.id = lease_tenant.tenant_id
where unit.property_id = $[propertyId]
order by lease.unit_id,
  lease.start_date desc
limit $[limit] offset $[offset] -- using lateral join, selecting by unit
  -- select name unit, latest.* from unit
  -- left join lateral(
  --  select string_agg(tenant.full_name, ',') tenant, lease.*
  -- 	from lease
  -- 		join lease_tenant on lease_tenant.lease_id = lease.id
  -- 		join tenant on tenant.id = lease_tenant.tenant_id
  -- 	where lease.unit_id = unit.id
  -- 	and lease.end_date > now()
  -- 	group by unit.name, lease.id
  -- 	order by end_date desc
  -- 	limit 1
  -- ) latest on true
  -- where unit.property_id = 6
  -- and unit.name < 'a4'
  -- order by unit.name desc
  -- fetch first 3 rows only;