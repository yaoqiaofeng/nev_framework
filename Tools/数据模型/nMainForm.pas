unit nMainForm;

interface

uses
  Windows, Messages, SysUtils, Variants, Classes, Graphics, Controls, Forms,
  Dialogs, ExtCtrls, StdCtrls, HTMLChkList, DBAccess, UniDacVcl, DALoader,
  UniLoader, DB, Uni, SQLServerUniProvider, UniProvider,
  MySQLUniProvider, PostgreSQLUniProvider, MemDS, AdvSplitter, DBGridEhGrouping,
  ToolCtrlsEh, DBGridEhToolCtrls, DynVarsEh, GridsEh, DBAxisGridsEh, DBGridEh;

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
    procedure Button1Click(Sender: TObject);
    procedure HTMLCheckList1Click(Sender: TObject);
    procedure Button2Click(Sender: TObject);
    procedure Button3Click(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
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
    if (UpperCase(dt) = UpperCase('tinyint')) or
       (UpperCase(dt) = UpperCase('bit')) then
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
      'const {cacheModel} = require("modelObject");'+slinebreak+
      'class '+tableName+' extends cacheModel{'+slinebreak+
      '   static fields(){'+slinebreak+
      '      return ['+fields+'];'+slinebreak+
      '   }'+slinebreak+
      slinebreak+
      '   static name(){'+slinebreak+
      '      return "'+HTMLCheckList1.Items[i]+'";'+slinebreak+
      '   }'+slinebreak+
      slinebreak+
      '   static types(){'+slinebreak+
      '      return ['+types+'];'+slinebreak+
      '   }'+slinebreak+
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

procedure TMainForm.Button3Click(Sender: TObject);
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
        sql_s := 'select * from '+tablename+space(10)+'where 1=1 ';
        sql_s_s := '';
        sql_d := 'delete * from '+tablename+space(10)+'where ';
        sql_u := 'update '+tablename+' set';
        sql_i := 'insert into '+tablename+'(';
        sql_i_v := '';
        while not MetaData.Eof do
        begin
          col := MetaData.FieldByName('COLUMN_NAME').AsString;
          dt := MetaData.FieldByName('DATA_TYPE').AsString;
          sql_s := sql_s+space(20)+'{if '+col+'} and '+col+'={{'+col+'}}{endif '+col+'}';
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
              sql_u := sql_u+space(20)+'{if '+col+'} '+col+'={{'+col+'}} {endif '+col+'}' else
              sql_u := sql_u+space(20)+'{if '+col+'},'+col+'={{'+col+'}} {endif '+col+'}';
            if sql_i = ('insert into '+tablename+'(') then
            begin
              sql_i := sql_i+space(20)+'{if '+col+'}'+col+'{endif '+col+'}';
              sql_i_v := '{if '+col+'}{{'+col+'}}{endif '+col+'}';
            end else
            begin
              sql_i := sql_i+space(20)+'{if '+col+'},'+col+'{endif '+col+'}';
              sql_i_v := sql_i_v+space(20)+'{if '+col+'},{{'+col+'}}{endif '+col+'}';
            end;
          end;
          if sql_d = ('delete * from '+tablename+space(10)+'where ') then
            sql_d := sql_d+'{if '+col+'} '+col+'={{'+col+'}}  {endif '+col+'}' else
            sql_d := sql_d+space(20)+'{if '+col+'} and '+col+'={{'+col+'}} {endif '+col+'}';
          MetaData.Next;
        end;
        sql_u := sql_u+space(10)+'where id={{id}}';
        sql_i := sql_i+') '+space(10)+'values('+sql_i_v+')';
        if (sql_s_s<>'') then
          sql_s_s := space(20)+'{if @search} and ('+sql_s_s+') {endif @search}';
        sql_s := sql_s+sql_s_s+
           space(20)+'{if @sort}order by {{@sort}}{endif}'+
           space(20)+'{if @page}limit {{@limit}} offset {{@offset}}{endif @page}'+
           space(20)+'{if !@page}limit 50 offset 0{endif !@page}';
      finally
        MetaData.Free;
      end;
      js :=
      'const {sqlModel} = require("modelObject");'+slinebreak+
      'class '+tableName+' extends sqlModel{'+slinebreak+
      '   static name(){'+slinebreak+
      '      return "'+HTMLCheckList1.Items[i]+'";'+slinebreak+
      '   }'+slinebreak+
      slinebreak+
      '   static sql(op){'+slinebreak+
      '      switch(op){'+slinebreak+
      '        case "select":'+slinebreak+
      '          return `'+slinebreak+
      '          '+sql_s+slinebreak+
      '                 `'+slinebreak+
      '        case "delete":'+slinebreak+
      '          return `'+slinebreak+
      '          '+sql_d+slinebreak+
      '                 `'+slinebreak+
      '        case "update":'+slinebreak+
      '          return `'+slinebreak+
      '          '+sql_u+slinebreak+
      '                 `'+slinebreak+
      '        case "insert":'+slinebreak+
      '          return `'+slinebreak+
      '          '+sql_i+slinebreak+
      '                 `'+slinebreak+
      '      }'+slinebreak+
      '   }'+slinebreak+
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

end.
