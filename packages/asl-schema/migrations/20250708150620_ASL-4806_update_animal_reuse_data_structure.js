/**
 * Previously `data.protocols[].speciesDetails[].reuse` was a yes/no question
 * stored as a boolean value. With the changes in ASL-4806 it is now an array
 * that can be:
 * - `['other-protocol']`: May come to this protocol after being used in another
 *   protocol
 * - `['this-protocol']`: May have the protocol applied more than once
 * - `['other-protocol', 'this-protocol']`: Both of the above
 * - `['no']`: Animals are not reused in this protocol
 *
 * This calculates the new value for each species in a protocol, using common
 * table expressions, and json aggregation to build that back into the expected
 * data object in the licence.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.raw(`
WITH detailsByProtocol
       AS (SELECT pv.id,
                  proto.idx AS proto_idx,
                  JSONB_AGG(
                          JSONB_SET(
                                  details.value,
                                  '{reuse}',
                                  CASE JSONB_TYPEOF(details.value -> 'reuse')
                                    WHEN 'array' THEN details.value -> 'reuse'
                                    ELSE
                                      TO_JSONB(
                                              ARRAY_REMOVE(
                                                      ARRAY [
                                                        CASE
                                                          WHEN (details.value -> 'reuse')::bool
                                                            THEN 'other-protocol'
                                                          ELSE NULL END,
                                                        CASE
                                                          WHEN NULLIF(details.value ->> 'maximum-times-used', '1') IS NOT NULL
                                                            THEN 'this-protocol'
                                                          ELSE NULL END,
                                                        CASE
                                                          WHEN NOT (
                                                            (details.value -> 'reuse')::bool OR
                                                            NULLIF(details.value ->> 'maximum-times-used', '1') IS NOT NULL)
                                                            THEN 'no'
                                                          ELSE NULL END
                                                        ], NULL)
                                      )
                                    END
                          )
                  )
                            AS speciesDetails
           FROM project_versions pv,
                JSONB_ARRAY_ELEMENTS(pv.data -> 'protocols') WITH ORDINALITY AS proto(value, idx),
                JSONB_ARRAY_ELEMENTS(proto.value -> 'speciesDetails') WITH ORDINALITY AS details(value, idx)
           GROUP BY pv.id, proto_idx, pv.status),
     protocolsByVersion AS (SELECT pv.id,
                                   JSONB_AGG(
                                           JSONB_STRIP_NULLS(
                                                   JSONB_SET(
                                                           JSONB_SET(
                                                                   proto.value,
                                                                   '{complete}',
                                                                   CASE pv.status
                                                                     WHEN 'draft' THEN TO_JSONB(FALSE)
                                                                     ELSE COALESCE(pv.data -> 'complete', TO_JSONB(FALSE))
                                                                     END
                                                           ),
                                                           '{speciesDetails}',
                                                           COALESCE(details.speciesDetails, proto.value -> 'speciesDetails', jsonb_build_array())
                                                   )
                                           )
                                   ) AS protocols
                            FROM project_versions pv
                                 CROSS JOIN JSONB_ARRAY_ELEMENTS(pv.data -> 'protocols') WITH ORDINALITY AS proto(value, idx)
                                 LEFT JOIN detailsByProtocol AS details
                                           ON pv.id = details.id AND proto.idx = details.proto_idx
                            GROUP BY pv.id, pv.status)
UPDATE project_versions pv
SET data = JSONB_SET(
        JSONB_SET(pv.data,
                  '{protocols-complete}',
                  CASE pv.status
                    WHEN 'draft' THEN TO_JSONB(FALSE)
                    ELSE COALESCE(pv.data -> 'protocols-complete', TO_JSONB(FALSE))
                    END
        ),
        '{protocols}',
        protocolsByVersion.protocols
           )
FROM protocolsByVersion
WHERE protocolsByVersion.id = pv.id
;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw(`
WITH detailsByProtocol
       AS (SELECT pv.id,
                  proto.idx AS proto_idx,
                  JSONB_AGG(
                          JSONB_SET(
                                  details.value,
                                  '{reuse}',
                                  to_jsonb(details.value -> 'reuse-details' IS NULL)
                          )
                  )
                            AS speciesDetails
           FROM project_versions pv,
                JSONB_ARRAY_ELEMENTS(pv.data -> 'protocols') WITH ORDINALITY AS proto(value, idx),
                JSONB_ARRAY_ELEMENTS(proto.value -> 'speciesDetails') WITH ORDINALITY AS details(value, idx)
           GROUP BY pv.id, proto_idx, pv.status),
     protocolsByVersion AS (SELECT pv.id,
                                   JSONB_AGG(
                                           JSONB_STRIP_NULLS(
                                                   JSONB_SET(
                                                           JSONB_SET(
                                                                   proto.value,
                                                                   '{complete}',
                                                                   CASE pv.status
                                                                     WHEN 'draft' THEN TO_JSONB(FALSE)
                                                                     ELSE COALESCE(pv.data -> 'complete', TO_JSONB(FALSE))
                                                                     END
                                                           ),
                                                           '{speciesDetails}',
                                                           COALESCE(details.speciesDetails, proto.value -> 'speciesDetails', jsonb_build_array())
                                                   )
                                           )
                                   ) AS protocols
                            FROM project_versions pv
                                 CROSS JOIN JSONB_ARRAY_ELEMENTS(pv.data -> 'protocols') WITH ORDINALITY AS proto(value, idx)
                                 LEFT JOIN detailsByProtocol AS details
                                           ON pv.id = details.id AND proto.idx = details.proto_idx
                            GROUP BY pv.id, pv.status)
UPDATE project_versions pv
SET data = JSONB_SET(
        JSONB_SET(pv.data,
                  '{protocols-complete}',
                  CASE pv.status
                    WHEN 'draft' THEN TO_JSONB(FALSE)
                    ELSE COALESCE(pv.data -> 'protocols-complete', TO_JSONB(FALSE))
                    END
        ),
        '{protocols}',
        protocolsByVersion.protocols
           )
FROM protocolsByVersion
WHERE protocolsByVersion.id = pv.id
;
  `);
};
