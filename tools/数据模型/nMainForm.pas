unit nMainForm;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, ExtCtrls, StdCtrls, HTMLChkList, DBAccess, UniDacVcl, DALoader,
  UniLoader, DB, Uni, SQLServerUniProvider, UniProvider,
  MySQLUniProvider, PostgreSQLUniProvider, MemDS, AdvSplitter, DBGridEhGrouping,
  ToolCtrlsEh, DBGridEhToolCtrls, DynVarsEh, GridsEh, DBAxisGridsEh, DBGridEh,
  ComCtrls, ADODB, ODBCUniProvider, AccessUniProvider;

type
  TMainForm = class(TForm)
    UniConnection1: TUniConnection;
    UniConnectDialog1: TUniConnectDialog;
    HTMLCheckList1: THTMLCheckList;
    Button1: TButton;
    Panel1: TPanel;
    MySQLUniProvider1: TMySQLUniProvider;
    SQLServerUniProvider1: TSQLServerUniProvider;
    PostgreSQLUniProvider1: TPostgreSQLUniProvider;
    AdvSplitter1: TAdvSplitter;
    UniDataSource1: TUniDataSource;
    DBGridEh1: TDBGridEh;
    Button2: TButton;
    Button3: TButton;
    PageControl1: TPageControl;
    TabSheet1: TTabSheet;
    TabSheet2: TTabSheet;
    ListView1: TListView;
    UniQuery1: TUniQuery;
    procedure Button1Click(Sender: TObject);
    procedure HTMLCheckList1Click(Sender: TObject);
    procedure Button2Click(Sender: TObject);
    procedure Button3Click(Sender: TObject);
  private
    { Private declarations }
    function GetDataName(DataType: string): string;
    function GetDataType(FieldType: string): string;
  public
    { Public declarations }
    procedure MYSQL_ExportCache;
    procedure MYSQL_ExportSQL;
    procedure MSSQL_ExportCache;
    procedure MSSQL_ExportSQL;
  end;

var
  MainForm: TMainForm;

implementation

{$R *.dfm}

procedure TMainForm.Button1Click(Sender: TObject);
begin
  UniConnectDialog1.Execute;
  UniConnection1.GetTableNames(HTMLCheckList1.Items);
  HTMLCheckList1.CheckAll;
end;

procedure TMainForm.Button2Click(Sender: TObject);
begin
  if UniConnection1.ProviderName = 'MySQL' then
    MYSQL_ExportCache
  else if UniConnection1.ProviderName = 'SQL Server' then
    MSSQL_ExportCache
end;

procedure TMainForm.Button3Click(Sender: TObject);
begin
  if UniConnection1.ProviderName = 'MySQL' then
    MYSQL_ExportSQL
  else if UniConnection1.ProviderName = 'SQL Server' then
    MSSQL_ExportSQL
end;

function TMainForm.GetDataName(DataType: string): string;
begin
  result := DataType;
  if (DataType='129') then
  begin
    result := 'varchar';
  end;
  if (DataType='133') then
  begin
    result := 'date';
  end;
  if (DataType='135') then
  begin
    result := 'datetime';
  end;
  if (DataType='11') then
  begin
    result := 'bit';
  end;
end;

function TMainForm.GetDataType(FieldType: string): string;
begin
  result := FieldType;
  if (FieldType='167') then
  begin
    result := '129';
  end;
  if (FieldType='40') then
  begin
    result := '133';
  end;
  if (FieldType='42') then
  begin
    result := '135';
  end;
  if (FieldType='104') then
  begin
    result := '11';
  end;
  if (FieldType='56') then
  begin
    result := '3';
  end;             
  if (FieldType='108') then
  begin
    result := '131';
  end;
end;

procedure TMainForm.HTMLCheckList1Click(Sender: TObject);
var
  MetaData: TDAMetaData;
begin
  if UniDataSource1.DataSet <> nil then
  begin
    UniDataSource1.DataSet.Free;
    UniDataSource1.DataSet := nil;
  end;
  MetaData := UniConnection1.CreateMetaData;
  UniDataSource1.DataSet := MetaData;
  MetaData.MetaDataKind := 'columns';
  MetaData.Restrictions.Add('SCOPE=LOCAL');
  MetaData.Restrictions.Add('TABLE_NAME=' + HTMLCheckList1.Items[HTMLCheckList1.ItemIndex]);
  MetaData.Open;
end;

procedure TMainForm.MSSQL_ExportCache;

var
  MetaData: TDAMetaData;
  function FieldTypeToJS: string;
  var
    dt : string;
    dp, ds : Integer;
  begin
    dt := GetDataName(MetaData.FieldByName('DATA_TYPE').AsString);
    dp := MetaData.FieldByName('DATA_PRECISION').AsInteger;
    ds := MetaData.FieldByName('DATA_SCALE').AsInteger;
    if (UpperCase(dt) = UpperCase('bit')) then
       result := 'boolean'
    else if (UpperCase(dt) = UpperCase('date')) or
       (UpperCase(dt) = UpperCase('datetime'))then
       result := 'datetime'
    else if (UpperCase(dt) = UpperCase('varchar')) or
       (UpperCase(dt) = UpperCase('nvarchar')) or
       (UpperCase(dt) = UpperCase('nchar')) or
       (UpperCase(dt) = UpperCase('char')) then
       result := 'string'
    else if (dp>0) and (ds=0) then
       result := 'int'
    else if (dp>0) and (ds>0) then
       result := 'float';
  end;
var
  I: Integer;
  M: TMemoryStream;
  js, fields, types, path, tableName : string;
begin
  M := TMemoryStream.Create;
  try
    path := ExtractFilePath(Application.ExeName)+'models\'+UniConnection1.Database+'\';
    ForceDirectories(path);
    for I := 0 to HTMLCheckList1.Items.Count - 1 do
    begin
      if not HTMLCheckList1.Checked[i] then
        continue;
      tableName := HTMLCheckList1.Items[i];
      MetaData := UniConnection1.CreateMetaData;
      try
        MetaData.MetaDataKind := 'columns';
        MetaData.Restrictions.Add('SCOPE=LOCAL');
        MetaData.Restrictions.Add('TABLE_NAME=' + tableName);
        MetaData.Open;
        fields := '';
        types := '';
        while not MetaData.Eof do
        begin
          if MetaData.FieldByName('COLUMN_Name').AsString='id' then
          begin
            MetaData.Next;
            Continue;
          end;
          fields := fields+'"'+MetaData.FieldByName('COLUMN_Name').AsString+'"';
          types := types+'"'+FieldTypeToJS+'"';
          MetaData.Next;
          if not MetaData.Eof  then
          begin
            types := types+',';
            fields := fields+',';
          end;
        end;
      finally
        MetaData.Free;
      end;
      js :=
      'const {CacheModel} = require("modelObject");'+slinebreak+
      'class '+tableName+' extends CacheModel{'+slinebreak+
      '    static fields(){'+slinebreak+
      '        return ['+fields+'];'+slinebreak+
      '    }'+slinebreak+
      slinebreak+
      '    static name(){'+slinebreak+
      '        return "'+HTMLCheckList1.Items[i]+'";'+slinebreak+
      '    }'+slinebreak+
      slinebreak+
      '    static types(){'+slinebreak+
      '        return ['+types+'];'+slinebreak+
      '    }'+slinebreak+
      '}'+slinebreak+
      'module.exports='+tableName+';';
      M.Clear;
      M.Write(js[1], length(js));
      M.SaveToFile(path+tableName+'.js');
    end;
  finally
    M.Free;
  end;
end;

procedure TMainForm.MSSQL_ExportSQL;            
var
  MetaData: TDAMetaData;
  function space(count: Integer): string;
  var
    I: Integer;
  begin
    SetLength(result, count);
    for I := 1 to count do
      Result[i] := ' ';
    result := sLineBreak + Result;
  end;
  function GetView(tableName: string): string;
  var
    I: Integer;
    L: TStringList;
    J: Integer;
    Aliase: Integer;
    AFields, ATable, AliaseName, AFix, AKey,
    ATablePrev, AliaseNamePrev: string;
    Bk: TBookmark;
  begin
    result := tableName;
    AFields := tableName+'.*';
    Aliase := 96;
    L:=TStringList.Create;
    try
      with MetaData do
      begin
        First;
        while not Eof do
        begin
          for I := 0 to ListView1.Items.Count - 1 do
          begin
            if ListView1.Items[i].Caption = FieldByName('COLUMN_NAME').AsString then
            begin
              ATable := ListView1.Items[i].SubItems[0];                              
              ATablePrev := FieldByName('TABLE_NAME').AsString;
              System.Delete(ATablePrev, Pos(' ',ATablePrev), MaxInt);
              AliaseNamePrev := FieldByName('TABLE_NAME').AsString;
              System.Delete(AliaseNamePrev, 0, Pos(' ',AliaseNamePrev));
              ATable := StringReplace(ATable,'#self', ATablePrev, [rfReplaceAll, rfIgnoreCase]);
              AFix := ListView1.Items[i].SubItems[3];
              AKey := ListView1.Items[i].SubItems[1];
              Inc(Aliase);
              AliaseName := Char(Aliase);
              AFields := AFields+space(28);
              Result := Result + ' left join'+space(28)+ATable+' '+AliaseName+' on '+
                AliaseName+'.'+AKey+'='+AliaseNamePrev+'.'+FieldByName('COLUMN_NAME').AsString;
              L.Delimiter := ',';
              L.DelimitedText := ListView1.Items[i].SubItems[2];
              Bk := GetBookmark;
              for J := 0 to L.count - 1 do
              begin
                Append;
                FieldByName('TABLE_NAME').AsString :=  ATable+' '+AliaseName;
                FieldByName('Column_Name').AsString :=  AFix+'_'+L[j];
                UniQuery1.Close;
                UniQuery1.SQL.text := 'select * from sys.columns where name=:name and object_name(object_id)=:object_name';
                UniQuery1.ParamByName('name').AsString := L[j];
                UniQuery1.ParamByName('object_name').AsString := ATable;
                UniQuery1.Open;
                FieldByName('DATA_TYPE').AsString :=  GetDataType(UniQuery1.FieldByName('system_type_id').AsString);
                FieldByName('DATA_LENGTH').AsString :=  UniQuery1.FieldByName('max_length').AsString;
                FieldByName('DATA_PRECISION').AsString:= UniQuery1.FieldByName('PRECISION').AsString;
                FieldByName('DATA_SCALE').AsString :=  UniQuery1.FieldByName('SCALE').AsString;
                UniQuery1.Close;
                AFields := AFields + ','+ATable+'.'+L[j]+' as '+AFix+'_'+L[j];
              end;
              GotoBookmark(Bk);
              break;
            end;
          end;
          Next;
        end;
        first;
      end;
      if (result <> tablename) then
        result := '('+space(20)+'select '+AFields+space(20)+'from '+result+space(16)+') modelView';
    finally
      L.Free;
    end;
  end;
var
  I: Integer;
  M: TMemoryStream;
  js, path, tableName, col, dt, tb : string;
  sql_i,sql_i_v, sql_d, sql_u, sql_s, sql_s_s : string;
begin
  M := TMemoryStream.Create;
  try
    path := ExtractFilePath(Application.ExeName)+'models\'+UniConnection1.Database+'\';
    ForceDirectories(path);
    for I := 0 to HTMLCheckList1.Items.Count - 1 do
    begin
      if not HTMLCheckList1.Checked[i] then
        continue;
      tableName := HTMLCheckList1.Items[i];
      MetaData := UniConnection1.CreateMetaData;
      try
        MetaData.MetaDataKind := 'columns';
        MetaData.Restrictions.Add('SCOPE=LOCAL');
        MetaData.Restrictions.Add('TABLE_NAME=' + tableName);
        MetaData.Open;
        sql_s := 'select {{fields}} from '+GetView(tablename)+space(16  )+'where 1=1 ';
        sql_s_s := '';
        sql_d := 'delete from '+tablename+space(16)+'where ';
        sql_u := 'update '+tablename+' set';
        sql_i := 'insert into '+tablename+'(';
        sql_i_v := '';
        while not MetaData.Eof do
        begin
          col := MetaData.FieldByName('COLUMN_NAME').AsString;
          dt := GetDataName(MetaData.FieldByName('DATA_TYPE').AsString);
          tb := MetaData.FieldByName('TABLE_NAME').AsString;
          //查询语句
          sql_s := sql_s+space(25)+'{if '+col+'} and '+col+'={{'+col+'}}{endif '+col+'}';
          if (UpperCase(dt) = UpperCase('varchar')) or
             (UpperCase(dt) = UpperCase('nvarchar')) or
             (UpperCase(dt) = UpperCase('nchar')) or
             (UpperCase(dt) = UpperCase('char')) then
          begin
            if sql_s_s <> '' then
              sql_s_s := sql_s_s+' OR ';
            sql_s_s := sql_s_s + space(29)+'.'+col+' like ''%@search%''';
          end;
          //增删改语句
          if (tb = tableName) then
          begin
            if (col<>'id') then
            begin
              if sql_u = ('update '+tablename+' set') then
                sql_u := sql_u+space(25)+'{if '+col+'} '+col+'={{'+col+'}} {endif '+col+'}' else
                sql_u := sql_u+space(25)+'{if '+col+'},'+col+'={{'+col+'}} {endif '+col+'}';
              if sql_i = ('insert into '+tablename+'(') then
              begin
                sql_i := sql_i+space(25)+'{if '+col+'}'+col+'{endif '+col+'}';
                sql_i_v := '{if '+col+'}{{'+col+'}}{endif '+col+'}';
              end else
              begin
                sql_i := sql_i+space(25)+'{if '+col+'},'+col+'{endif '+col+'}';
                sql_i_v := sql_i_v+space(25)+'{if '+col+'},{{'+col+'}}{endif '+col+'}';
              end;
            end;
            if sql_d = ('delete * from '+tablename+space(15)+'where ') then
              sql_d := sql_d+'{if '+col+'} '+col+'={{'+col+'}}  {endif '+col+'}' else
              sql_d := sql_d+space(25)+'{if '+col+'} and '+col+'={{'+col+'}} {endif '+col+'}';
          end;
          MetaData.Next;
        end;
        //组合
        sql_u := sql_u+space(16)+'where id={{id}}';
        sql_i := sql_i+') '+space(16)+'values('+sql_i_v+')';
        if (sql_s_s<>'') then
          sql_s_s := space(25)+'{if @search} and ('+sql_s_s+space(25)+') {endif @search}';
        sql_s := sql_s+sql_s_s+
           space(25)+'{if @sort}'+space(29)+'order by {{@sort}}'+
           space(29)+'{if @page}OFFSET {{@offset}} ROW FETCH NEXT {{@limit}} ROWS only {endif @page}'+
           space(25)+'{endif @sort}';
      finally
        MetaData.Free;
      end;
      js :=
      'const {SqlModel} = require("modelObject");'+slinebreak+
      'class '+tableName+' extends SqlModel{'+slinebreak+
      '    static name(){'+slinebreak+
      '        return "'+HTMLCheckList1.Items[i]+'";'+slinebreak+
      '    }'+slinebreak+
      slinebreak+
      '    static sql(op){'+slinebreak+
      '        switch(op){'+slinebreak+
      '            case "select":'+slinebreak+
      '                return `'+slinebreak+
      '                '+sql_s+slinebreak+
      '                `'+slinebreak+
      '            case "delete":'+slinebreak+
      '                return `'+slinebreak+
      '                '+sql_d+slinebreak+
      '                `'+slinebreak+
      '            case "update":'+slinebreak+
      '                return `'+slinebreak+
      '                '+sql_u+slinebreak+
      '                `'+slinebreak+
      '            case "insert":'+slinebreak+
      '                return `'+slinebreak+
      '                '+sql_i+slinebreak+
      '                `'+slinebreak+
      '        }'+slinebreak+
      '    }'+slinebreak+
      '}'+slinebreak+
      'module.exports='+tableName+';';
      M.Clear;
      M.Write(js[1], length(js));
      M.SaveToFile(path+tableName+'.js');
    end;
  finally
    M.Free;
  end;
end;

procedure TMainForm.MYSQL_ExportCache;
var
  MetaData: TDAMetaData;
  function FieldTypeToJS: string;
  var
    dt : string;
    dp, ds : Integer;
  begin
    dt := MetaData.FieldByName('DATA_TYPE').AsString;
    dp := MetaData.FieldByName('DATA_PRECISION').AsInteger;
    ds := MetaData.FieldByName('DATA_SCALE').AsInteger;
    if (UpperCase(dt) = UpperCase('tinyint')) then
       result := 'boolean'
    else if (UpperCase(dt) = UpperCase('date')) or
       (UpperCase(dt) = UpperCase('datetime')) then
       result := 'datetime'
    else if (UpperCase(dt) = UpperCase('varchar')) or
       (UpperCase(dt) = UpperCase('nvarchar')) or
       (UpperCase(dt) = UpperCase('nchar')) or
       (UpperCase(dt) = UpperCase('char')) then
       result := 'string'
    else if (dp>0) and (ds=0) then
       result := 'int'
    else if (dp>0) and (ds>0) then
       result := 'float';
  end;
var
  I: Integer;
  M: TMemoryStream;
  js, fields, types, path, tableName : string;
begin
  M := TMemoryStream.Create;
  try
    path := ExtractFilePath(Application.ExeName)+'models\'+UniConnection1.Database+'\';
    ForceDirectories(path);
    for I := 0 to HTMLCheckList1.Items.Count - 1 do
    begin
      if not HTMLCheckList1.Checked[i] then
        continue;
      tableName := HTMLCheckList1.Items[i];
      MetaData := UniConnection1.CreateMetaData;
      try
        MetaData.MetaDataKind := 'columns';
        MetaData.Restrictions.Add('SCOPE=LOCAL');
        MetaData.Restrictions.Add('TABLE_NAME=' + tableName);
        MetaData.Open;
        fields := '';
        types := '';
        while not MetaData.Eof do
        begin
          if MetaData.FieldByName('COLUMN_Name').AsString='id' then
          begin
            MetaData.Next;
            Continue;
          end;
          fields := fields+'"'+MetaData.FieldByName('COLUMN_Name').AsString+'"';
          types := types+'"'+FieldTypeToJS+'"';
          MetaData.Next;
          if not MetaData.Eof  then
          begin
            types := types+',';
            fields := fields+',';
          end;
        end;
      finally
        MetaData.Free;
      end;
      js :=
      'const {CacheModel} = require("modelObject");'+slinebreak+
      'class '+tableName+' extends CacheModel{'+slinebreak+
      '    static fields(){'+slinebreak+
      '        return ['+fields+'];'+slinebreak+
      '    }'+slinebreak+
      slinebreak+
      '    static name(){'+slinebreak+
      '        return "'+HTMLCheckList1.Items[i]+'";'+slinebreak+
      '    }'+slinebreak+
      slinebreak+
      '     static types(){'+slinebreak+
      '        return ['+types+'];'+slinebreak+
      '    }'+slinebreak+
      '}'+slinebreak+
      'module.exports='+tableName+';';
      M.Clear;
      M.Write(js[1], length(js));
      M.SaveToFile(path+tableName+'.js');
    end;
  finally
    M.Free;
  end;
end;

procedure TMainForm.MYSQL_ExportSQL;
  function space(count: Integer): string;
  var
    I: Integer;
  begin
    SetLength(result, count);
    for I := 1 to count do
      Result[i] := ' ';
    result := sLineBreak + Result;
  end;
var
  MetaData: TDAMetaData;
var
  I: Integer;
  M: TMemoryStream;
  js, path, tableName, col, dt : string;
  sql_i,sql_i_v, sql_d, sql_u, sql_s, sql_s_s : string;
begin
  M := TMemoryStream.Create;
  try
    path := ExtractFilePath(Application.ExeName)+'models\'+UniConnection1.Database+'\';
    ForceDirectories(path);
    for I := 0 to HTMLCheckList1.Items.Count - 1 do
    begin
      if not HTMLCheckList1.Checked[i] then
        continue;
      tableName := HTMLCheckList1.Items[i];
      MetaData := UniConnection1.CreateMetaData;
      try
        MetaData.MetaDataKind := 'columns';
        MetaData.Restrictions.Add('SCOPE=LOCAL');
        MetaData.Restrictions.Add('TABLE_NAME=' + tableName);
        MetaData.Open;
        sql_s := 'select {{fields}} from '+tablename+space(15)+'where 1=1 ';
        sql_s_s := '';
        sql_d := 'delete from '+tablename+space(15)+'where ';
        sql_u := 'update '+tablename+' set';
        sql_i := 'insert into '+tablename+'(';
        sql_i_v := '';
        while not MetaData.Eof do
        begin
          col := MetaData.FieldByName('COLUMN_NAME').AsString;
          dt := MetaData.FieldByName('DATA_TYPE').AsString;
          sql_s := sql_s+space(25)+'{if '+col+'} and '+col+'={{'+col+'}}{endif '+col+'}';
          if (UpperCase(dt) = UpperCase('varchar')) or
             (UpperCase(dt) = UpperCase('nvarchar')) or
             (UpperCase(dt) = UpperCase('nchar')) or
             (UpperCase(dt) = UpperCase('char')) then
          begin
            if sql_s_s <> '' then
              sql_s_s := sql_s_s+' OR ';
            sql_s_s := sql_s_s + col+' like ''%@search%''';
          end;
          if (col<>'id') then
          begin
            if sql_u = ('update '+tablename+' set') then
              sql_u := sql_u+space(25)+'{if '+col+'} '+col+'={{'+col+'}} {endif '+col+'}' else
              sql_u := sql_u+space(25)+'{if '+col+'},'+col+'={{'+col+'}} {endif '+col+'}';
            if sql_i = ('insert into '+tablename+'(') then
            begin
              sql_i := sql_i+space(25)+'{if '+col+'}'+col+'{endif '+col+'}';
              sql_i_v := '{if '+col+'}{{'+col+'}}{endif '+col+'}';
            end else
            begin
              sql_i := sql_i+space(25)+'{if '+col+'},'+col+'{endif '+col+'}';
              sql_i_v := sql_i_v+space(25)+'{if '+col+'},{{'+col+'}}{endif '+col+'}';
            end;
          end;
          if sql_d = ('delete * from '+tablename+space(15)+'where ') then
            sql_d := sql_d+'{if '+col+'} '+col+'={{'+col+'}}  {endif '+col+'}' else
            sql_d := sql_d+space(25)+'{if '+col+'} and '+col+'={{'+col+'}} {endif '+col+'}';
          MetaData.Next;
        end;
        sql_u := sql_u+space(15)+'where id={{id}}';
        sql_i := sql_i+') '+space(15)+'values('+sql_i_v+')';
        if (sql_s_s<>'') then
          sql_s_s := space(25)+'{if @search} and ('+sql_s_s+') {endif @search}';
        sql_s := sql_s+sql_s_s+
           space(25)+'{if @sort}order by {{@sort}}{endif @sort}'+
           space(25)+'{if @page}limit {{@limit}} offset {{@offset}}{endif @page}';
      finally
        MetaData.Free;
      end;
      js :=
      'const {SqlModel} = require("modelObject");'+slinebreak+
      'class '+tableName+' extends SqlModel{'+slinebreak+
      '    static name(){'+slinebreak+
      '        return "'+HTMLCheckList1.Items[i]+'";'+slinebreak+
      '    }'+slinebreak+
      slinebreak+
      '    static sql(op){'+slinebreak+
      '        switch(op){'+slinebreak+
      '           case "select":'+slinebreak+
      '               return `'+slinebreak+
      '               '+sql_s+slinebreak+
      '               `'+slinebreak+
      '           case "delete":'+slinebreak+
      '               return `'+slinebreak+
      '               '+sql_d+slinebreak+
      '               `'+slinebreak+
      '           case "update":'+slinebreak+
      '               return `'+slinebreak+
      '               '+sql_u+slinebreak+
      '               `'+slinebreak+
      '           case "insert":'+slinebreak+
      '               return `'+slinebreak+
      '               '+sql_i+slinebreak+
      '               `'+slinebreak+
      '       }'+slinebreak+
      '    }'+slinebreak+
      '}'+slinebreak+
      'module.exports='+tableName+';';
      M.Clear;
      M.Write(js[1], length(js));
      M.SaveToFile(path+tableName+'.js');
    end;
  finally
    M.Free;
  end;
end;

end.
