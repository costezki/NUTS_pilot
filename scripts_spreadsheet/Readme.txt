The steps to transform the NUTS evolution from the spreadsheet to RDF are:
1. Apply the RDF Skeleton to the spreadsheet using Google Refine
	1. Import the spreadsheet on Google Refine
	2. Remove the remove first row after importing
	3. Apply the skeleton
	4. Export in an RDF file
2. Execute the NUTS.py script. Note: the script is developed using python 3.x. It is also important to take into account:
	1. The number of rows that the spreadsheet has are hardcoded in the code (lines 63 and 85)
	2. Also, the names of the input file has to be modfied (code line 40)
3. The python script does not create all the triples, it depends on the types of changes. Therefore, extra triples need to be created. This is indicated inside the script.
4. Consolidate all results, i.e. the triples from Google Refine, from the execution of the script and the triples manually created.
5. Upload the consolidated file to virtuoso.