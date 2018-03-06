SELECT
val.field_value_value scientificNameId, fileref.field_filereference_target_id file_id, filem.filename, n.title desctiption_title
FROM [node] n
JOIN [field_data_field_tags] tags ON tags.entity_id = n.nid AND tags.field_tags_tid = 35 -- "Taxon Description"
JOIN [field_data_field_filereference] fileref ON fileref.entity_id = n.nid
JOIN [file_managed] filem ON filem.fid = fileref.field_filereference_target_id
JOIN [field_data_field_reference] ref ON ref.entity_id = n.nid AND ref.bundle = 'description'
JOIN [node] refnode ON refnode.nid = ref.field_reference_target_id
JOIN [field_data_field_literal] lit ON lit.entity_id = refnode.nid AND lit.bundle = 'resource'
JOIN [field_data_field_value] val ON val.entity_id = lit.field_literal_value

WHERE n.language IN ('nb', 'und')
ORDER BY [n].changed DESC

Åslaug V sier det kan være litt problematisk med cover-bildene fordi de i en god del tilfeller er svg-plansjer.
Men, hver beskrivelsesartikler skal ha en filreferanse til et bilde - og dette kan brukes.

Vedlagt spørringa (gjøres mot Drupal7Content databasen), og resultatet (2911 innslag)

Fil-id brukes slik: https://artsdatabanken.no/Media/F{fil-id}?mode320x320
Eksempel: https://artsdatabanken.no/Media/F674?mode=320x320

?mode er optional, dropp for full størrelse på bildet.
