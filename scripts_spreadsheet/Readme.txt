The steps to transform the NUTS evolution from the spreadsheet to RDF are listed below. Do these steps for each of the spreadsheets.

1. Apply the RDF Skeleton to the spreadsheet using Google Refine
	1. Import the spreadsheet on Open Refine
	2. Remove the remove first row after importing. More specifically, set "Parse next 1 line as column header" and "Discard initial 1 row of data". The other values should be zero.
	3. Apply the skeleton. This can be done by clicking Undo/Redo > Apply... and pasting the Skeleton file into the dialog.
	4. Export the result in an RDF file

2. Execute the NUTS.py (for the most recent spreadsheet) or NUTS_historic.py (for the older spreadsheets) script. Note: the script is developed using python 3.x. It is also important to take into account:
	1. The number of rows that the spreadsheet has should be given as the first argument
	2. Also, the names of the input file has to be provided as the second argument and the file must be an *.xlsx file
For example, the "nutsdata.xlsx" file with 2000 lines of data could be processed as follows from the terminal/cmd:
> python NUTS.py 2000 nutsdata.xlsx
	3. There are some parts of the code that have to be manually updated if the years of the spreadsheets are different. These parts are the filename of the file that will contain the changes and the name of the sheet that contains the information. For NUTS.py, this info is on lines 51 and 60. For NUTS_historic.py, it is on lines 56 and 65.
	
3. The python script does not create all the triples, it depends on the types of changes. For now, the script deals with Narrow/Broad relations between the codes, the status of the codes and the replacedBy/replaces relations for the codes that have a change of type (recoded/boundary shift/boundary change). If other changes may occur, extra triples need to be created. This can be done by extending the script or by creating the triples manually. For instance, merges and splits are not created automatically and must be created manually.
 
4. Consolidate all results of all spreadsheets, i.e. the triples from Google Refine, from the execution of the script and the triples manually created.

5. Upload the consolidated file to virtuoso, from which an RDF file can be retrieved.

6. Check the RDF file for duplicate preferred labels and remove the ones that are superfluous.


More detailed descriptions can be found in NUTStechnicalguide.pdf
